using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartStayHaven.API.Data;
using SmartStayHaven.API.Models;

namespace SmartStayHaven.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookingController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BookingController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Booking>>> GetBookings(
            [FromQuery] int? guestId = null,
            [FromQuery] string? status = null,
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null)
        {
            var query = _context.Bookings
                .Include(b => b.Room)
                .Include(b => b.Guest)
                .AsQueryable();

            if (guestId.HasValue)
                query = query.Where(b => b.GuestId == guestId.Value);

            if (!string.IsNullOrWhiteSpace(status))
                query = query.Where(b => b.Status == status);

            if (startDate.HasValue)
                query = query.Where(b => b.CheckInDate >= startDate.Value);

            if (endDate.HasValue)
                query = query.Where(b => b.CheckOutDate <= endDate.Value);

            return await query.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Booking>> GetBooking(int id)
        {
            var booking = await _context.Bookings
                .Include(b => b.Room)
                .Include(b => b.Guest)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (booking == null)
                return NotFound();

            return booking;
        }

        [HttpPost]
        public async Task<ActionResult<Booking>> CreateBooking(Booking booking)
        {
            // Check if room is available for the requested dates
            var isRoomAvailable = await IsRoomAvailable(booking.RoomId, booking.CheckInDate, booking.CheckOutDate);
            if (!isRoomAvailable)
                return BadRequest("Room is not available for the selected dates");

            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBooking), new { id = booking.Id }, booking);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBooking(int id, Booking booking)
        {
            if (id != booking.Id)
                return BadRequest();

            booking.LastUpdated = DateTime.UtcNow;
            _context.Entry(booking).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BookingExists(id))
                    return NotFound();
                throw;
            }

            return NoContent();
        }

        [HttpPost("{id}/cancel")]
        public async Task<IActionResult> CancelBooking(int id, [FromBody] string reason)
        {
            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null)
                return NotFound();

            booking.Status = "Cancelled";
            booking.CancellationReason = reason;
            booking.CancelledAt = DateTime.UtcNow;
            booking.LastUpdated = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBooking(int id)
        {
            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null)
                return NotFound();

            _context.Bookings.Remove(booking);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost("{id}/checkout")]
        public async Task<ActionResult<Booking>> Checkout(int id, [FromBody] CheckoutRequest request)
        {
            var booking = await _context.Bookings
                .Include(b => b.Room)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (booking == null)
                return NotFound();

            if (booking.Status == "Completed")
                return BadRequest("Booking is already checked out");

            if (booking.Status == "Cancelled")
                return BadRequest("Cannot checkout a cancelled booking");

            // Update booking status and details
            booking.Status = "Completed";
            booking.LastUpdated = DateTime.UtcNow;

            // Add any additional charges to the total amount
            if (request.AdditionalCharges.HasValue)
            {
                booking.TotalAmount += request.AdditionalCharges.Value;
            }

            // Update room status
            booking.Room.Status = "Available";

            // Save changes
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Booking = booking,
                CheckoutTime = request.ActualCheckOutTime,
                IsEarlyCheckout = request.IsEarlyCheckout,
                AdditionalCharges = request.AdditionalCharges,
                PaymentMethod = request.PaymentMethod
            });
        }

        private bool BookingExists(int id)
        {
            return _context.Bookings.Any(e => e.Id == id);
        }

        private async Task<bool> IsRoomAvailable(int roomId, DateTime checkIn, DateTime checkOut)
        {
            return !await _context.Bookings
                .AnyAsync(b => b.RoomId == roomId &&
                              b.Status != "Cancelled" &&
                              b.Status != "Completed" &&
                              ((checkIn >= b.CheckInDate && checkIn < b.CheckOutDate) ||
                               (checkOut > b.CheckInDate && checkOut <= b.CheckOutDate) ||
                               (checkIn <= b.CheckInDate && checkOut >= b.CheckOutDate)));
        }
    }
} 