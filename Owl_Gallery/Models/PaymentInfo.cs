using System.ComponentModel.DataAnnotations;

namespace Owl_Gallery.ViewModels
{
    public class PaymentInfo
    {
        [Required] public string CardName { get; set; }
        [Required] public string CardNumber { get; set; }
        [Required] public string Expiry { get; set; }
        [Required] public string Cvc { get; set; }
    }
}
