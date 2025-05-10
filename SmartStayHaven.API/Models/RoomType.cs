using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace SmartStayHaven.API.Models
{
    public class RoomType
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public required string Name { get; set; }

        [Required]
        public required string Description { get; set; }

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
        [JsonIgnore] // ← Now this will work
        public ICollection<Room>? Rooms { get; set; }
    }
} 