using System.ComponentModel.DataAnnotations;

namespace Owl_Gallery.ViewModels
{
    public class PaymentInfo
    {
        [Required(ErrorMessage = "Name on card is required")]
        [Display(Name = "Name on card")]
        public string CardName { get; set; }

        [Required(ErrorMessage = "Card number is required")]
        [RegularExpression(@"^\d{16}$", ErrorMessage = "Card number must be exactly 16 digits")]
        public string CardNumber { get; set; }

        [Required(ErrorMessage = "Expiry date is required")]
        [RegularExpression(@"^(0[1-9]|1[0-2])\/\d{2}$", ErrorMessage = "Expiry must be in MM/YY")]
        public string Expiry { get; set; }

        [Required(ErrorMessage = "CVC is required")]
        [RegularExpression(@"^\d{3}$", ErrorMessage = "CVC must be 3 digits")]
        public string Cvc { get; set; }
    }
}
