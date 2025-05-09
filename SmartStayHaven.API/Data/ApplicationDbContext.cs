using Microsoft.EntityFrameworkCore;
using SmartStayHaven.API.Models;

namespace SmartStayHaven.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Room> Rooms { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<MaintenanceRequest> MaintenanceRequests { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<Charge> Charges { get; set; }
        public DbSet<Employee> Employees { get; set; }
        public DbSet<RoomAmenity> RoomAmenities { get; set; }
        public DbSet<RoomType> RoomTypes { get; set; }
        public DbSet<RoomServiceOrder> RoomServiceOrders { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure relationships
            modelBuilder.Entity<MaintenanceRequest>()
                .HasOne(m => m.AssignedTo)
                .WithMany()
                .HasForeignKey(m => m.AssignedToId)
                .OnDelete(DeleteBehavior.SetNull);

            // Configure Room entity
            modelBuilder.Entity<Room>()
                .Property(r => r.PricePerNight)
                .HasColumnType("decimal(18,2)");

            // Configure Booking entity
            modelBuilder.Entity<Booking>()
                .Property(b => b.TotalAmount)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<Payment>()
                .Property(p => p.Amount)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<Charge>()
                .Property(c => c.Amount)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<Charge>()
                .Property(c => c.UnitPrice)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<RoomType>()
                .Property(rt => rt.BasePrice)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<RoomServiceOrder>()
                .Property(rso => rso.TotalAmount)
                .HasColumnType("decimal(18,2)");

            // Configure RoomType relationship with Room
            modelBuilder.Entity<Room>()
                .HasOne(r => r.RoomType)
                .WithMany(rt => rt.Rooms)
                .HasForeignKey("RoomTypeId")
                .OnDelete(DeleteBehavior.Restrict);

            // Configure RoomAmenity relationship with Room
            modelBuilder.Entity<RoomAmenity>()
                .HasOne(ra => ra.Room)
                .WithMany()
                .HasForeignKey(ra => ra.RoomId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure RoomServiceOrder relationships
            modelBuilder.Entity<RoomServiceOrder>()
                .HasOne(rso => rso.Booking)
                .WithMany()
                .HasForeignKey(rso => rso.BookingId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<RoomServiceOrder>()
                .HasOne(rso => rso.AssignedTo)
                .WithMany()
                .HasForeignKey(rso => rso.AssignedToId)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
} 