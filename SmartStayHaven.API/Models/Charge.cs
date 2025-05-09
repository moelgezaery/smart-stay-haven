using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartStayHaven.API.Models
{
    public class Charge
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int BookingId { get; set; }

        [Required]
        public string Type { get; set; } = "Room Service";

        [Required]
        public string Category { get; set; } = "Food";

        [Required]
        public string Description { get; set; }

        [Required]
        public decimal Amount { get; set; }

        [Required]
        public int Quantity { get; set; } = 1;

        public decimal UnitPrice { get; set; }

        [Required]
        public string Status { get; set; } = "Posted";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? PostedAt { get; set; }

        [ForeignKey("BookingId")]
        public Booking? Booking { get; set; }
    }
} 