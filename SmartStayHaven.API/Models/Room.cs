using System.ComponentModel.DataAnnotations;

namespace SmartStayHaven.API.Models
{
    public class Room
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public required string RoomNumber { get; set; }

        [Required]
        public decimal PricePerNight { get; set; }

        [Required]
        public required string Status { get; set; } = "Available";

        public string? Description { get; set; }

        public int Floor { get; set; }

        public int Capacity { get; set; }

        public bool HasBalcony { get; set; }

        public bool HasOceanView { get; set; }

        public int RoomTypeId { get; set; }
        public RoomType? RoomType { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? LastUpdated { get; set; }
    }
} 