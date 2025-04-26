using System.ComponentModel.DataAnnotations;
namespace Owl_Gallery.Models
{
    public class Product
    {
        public int Id { get; set; }

        [Required, MaxLength(120)]
        public string Name { get; set; }

        [Required, MaxLength(50)]
        public string Category { get; set; }         // Necklaces, Rings …

        [Range(0, 99999)]
        public decimal Price { get; set; }

        [Required, MaxLength(250)]
        public string ImageUrl { get; set; }
        public int Quantity { get; set; }

    }
}
