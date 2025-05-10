using Microsoft.EntityFrameworkCore;
using SmartStayHaven.API.Models;
using System.Security.Cryptography;
using System.Text;

namespace SmartStayHaven.API.Data
{
    public static class DbInitializer
    {
        public static async Task Initialize(ApplicationDbContext context)
        {
            // Ensure database is created
            await context.Database.EnsureCreatedAsync();

            // Check if we already have data
            if (await context.Users.AnyAsync())
            {
                return; // Database has been seeded
            }

            // Add test users
            var adminUser = new User
            {
                Email = "admin@hotel.com",
                PasswordHash = HashPassword("password"),
                FirstName = "Admin",
                LastName = "User",
                Role = "Admin",
                CreatedAt = DateTime.UtcNow
            };

            var staffUser = new User
            {
                Email = "staff@hotel.com",
                PasswordHash = HashPassword("password"),
                FirstName = "Staff",
                LastName = "User",
                Role = "Staff",
                CreatedAt = DateTime.UtcNow
            };

            context.Users.AddRange(adminUser, staffUser);
            await context.SaveChangesAsync();

            // Add room type
            var standardRoomType = new RoomType
            {
                Name = "Standard Room",
                Description = "Comfortable room with essential amenities",
                BasePrice = 150.00m,
                Capacity = 2,
                Features = "Queen bed, TV, WiFi, Air conditioning",
                IsActive = true
            };

            context.RoomTypes.Add(standardRoomType);
            await context.SaveChangesAsync();

            // Add test rooms first
            var rooms = new List<Room>
            {
                new Room
                {
                    RoomNumber = "102",
                    RoomTypeId = 1,
                    Status = "Available",
                    Floor = 1,
                    Capacity = 2
                },
                new Room
                {
                    RoomNumber = "204",
                    RoomTypeId = 1,
                    Status = "Available",
                    Floor = 2,
                    Capacity = 2
                }
            };

            context.Rooms.AddRange(rooms);
            await context.SaveChangesAsync();

            // Add test maintenance requests
            var maintenanceRequests = new List<MaintenanceRequest>
            {
                new MaintenanceRequest
                {
                    RoomId = rooms[0].Id,
                    Title = "AC Issue - Room 102",
                    Description = "AC not cooling properly",
                    Priority = "High",
                    Status = "Pending",
                    CreatedAt = DateTime.UtcNow,
                    ResolutionNotes = "Guest complained room temperature is above 78°F despite AC set to 65°F"
                },
                new MaintenanceRequest
                {
                    RoomId = rooms[1].Id,
                    Title = "Shower Leak - Room 204",
                    Description = "Leaking shower head",
                    Priority = "Medium",
                    Status = "InProgress",
                    CreatedAt = DateTime.UtcNow,
                    AssignedToId = staffUser.Id,
                    ResolutionNotes = "Water leaking onto bathroom floor causing slippery conditions"
                }
            };

            context.MaintenanceRequests.AddRange(maintenanceRequests);
            await context.SaveChangesAsync();
        }

        private static string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return Convert.ToBase64String(hashedBytes);
            }
        }
    }
} 