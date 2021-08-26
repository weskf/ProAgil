using System.ComponentModel.DataAnnotations;

namespace ProAgil.API.Dtos
{
    public class LoteDto
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public decimal Preco { get; set; }
        [Required(ErrorMessage = "Data é obrigatória")]
        public string DataInicio { get; set; }
        public string DataFim { get; set; }
        [Range(1, 5, ErrorMessage = "Lote não pode ser maior que 5")]
        public int Quantidade { get; set; }        
    }
}