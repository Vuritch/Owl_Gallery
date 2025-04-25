using System.ComponentModel.DataAnnotations;

namespace Owl_Gallery.ViewModels
{
    public class ShippingInfo
    {
        [Required] public string FirstName { get; set; }
        [Required] public string LastName { get; set; }
        [Required] public string Address1 { get; set; }
        public string Address2 { get; set; }
        [Required] public string City { get; set; }
        [Required] public string State { get; set; }
        [Required] public string PostalCode { get; set; }
        [Required] public string Country { get; set; }
    }
}
