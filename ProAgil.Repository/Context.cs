using Microsoft.EntityFrameworkCore;
using ProAgil.Domain;

namespace ProAgil.Repository
{
    public class Context : DbContext
    {
        public Context(DbContextOptions<Context> options) : base(options) {}

         public DbSet<Evento> Eventos { get; set; }  
        public DbSet<Palestrante> Palestrantes { get; set; }   
        public DbSet<RedeSocial> RedeSocials { get; set; }   
        public DbSet<Lote> Lotes { get; set; }   
        public DbSet<PalestranteEvento> PalestrantesEventos { get; set; }     

        protected override void OnModelCreating(ModelBuilder modelBuilder){
            modelBuilder.Entity<PalestranteEvento>()
            .HasKey(pe => new {pe.EventoId, pe.PalestranteId});
        }
    }
}