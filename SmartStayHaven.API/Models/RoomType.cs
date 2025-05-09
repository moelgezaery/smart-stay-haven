using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartStayHaven.API.Models
{
    public class RoomType
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public required string Name { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public decimal BasePrice { get; set; }

        [Required]
        public int Capacity { get; set; }

        public string? Features { get; set; }

        public string? ImageUrl { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? LastUpdated { get; set; }

        // Navigation property
        public ICollection<Room>? Rooms { get; set; }
    }
} 