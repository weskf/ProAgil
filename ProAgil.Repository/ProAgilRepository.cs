using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ProAgil.Domain;

namespace ProAgil.Repository
{
    public class ProAgilRepository : IProAgilRepository
    {
        private readonly Context _context;

        public ProAgilRepository(Context contexto)
        {
            _context = contexto;    
            _context.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;  
        }   

        public async Task<Evento[]> GetAllEventoAsync(bool includePalestrantes = false)
        {
            IQueryable<Evento> query = _context.Eventos
            .Include(c => c.Lotes)
            .Include(c => c.RedesSociais);

            if(includePalestrantes)
            {
                query = query.Include(pe => pe.PalestrantesEventos)
                .ThenInclude(p => p.Palestrante);
            }

            query = query
            .AsNoTracking()
            .OrderBy(c => c.Id);

            return await query.ToArrayAsync();
        }
        public async Task<Evento[]> GetAllEventoAsyncByTema(string tema, bool includePalestrantes)
        {
            IQueryable<Evento> query = _context.Eventos
            .Include(c => c.Lotes)
            .Include(c => c.RedesSociais);

            if(includePalestrantes)
            {
                query = query.Include(pe => pe.PalestrantesEventos)
                .ThenInclude(p => p.Palestrante);
            }

            query = query.OrderByDescending(c => c.DataEvento)
                .AsNoTracking()
                .Where(c => c.Tema.ToLower().Contains(tema.ToLower()));

            return await query.ToArrayAsync();
        }      
        public async Task<Evento> GetEventoAsyncById(int EventoId, bool includePalestrantes)
        {
            IQueryable<Evento> query = _context.Eventos
            .Include(c => c.Lotes)
            .Include(c => c.RedesSociais);

            if(includePalestrantes)
            {
                query = query.Include(pe => pe.PalestrantesEventos)
                .ThenInclude(p => p.Palestrante);
            }

            query = query.OrderByDescending(c => c.DataEvento)
                .AsNoTracking()
                .Where(c => c.Id == EventoId);

            return await query.FirstOrDefaultAsync();
        }
        public async Task<Palestrante[]> GetAllPalestranteAsyncByName(string nome, bool includeEvento)
        {
           IQueryable<Palestrante> query = _context.Palestrantes            
            .Include(c => c.RedesSociais);

            if(includeEvento)
            {
                query = query.Include(pe => pe.PalestrantesEventos)
                .ThenInclude(e => e.Evento);
            }

            query = query
                .OrderBy(c => c.Nome)
                .AsNoTracking()
                .Where(c => c.Nome.ToLower().Contains(nome.ToLower()));

            return await query.ToArrayAsync();
        }
        public async Task<Palestrante> GetPalestranteAsync(int PalestranteId, bool includeEvento = false)
        {
            IQueryable<Palestrante> query = _context.Palestrantes            
            .Include(c => c.RedesSociais);

            if(includeEvento)
            {
                query = query.Include(pe => pe.PalestrantesEventos)
                .ThenInclude(e => e.Evento);
            }

            query = query
                .OrderBy(c => c.Nome)
                .AsNoTracking()
                .Where(c => c.Id == PalestranteId);

            return await query.FirstOrDefaultAsync();
        }       
        public void Add<T>(T entity) where T : class
        {
           _context.Add(entity);
        }
        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }
        public void Update<T>(T entity) where T : class
        {
            _context.Update(entity);
        }
         public async Task<bool> SaveChangeAsync()
        {
            return (await _context.SaveChangesAsync()) > 0;
        }
    }
}