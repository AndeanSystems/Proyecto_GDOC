using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;

namespace Gdoc.Entity.Models.Mapping
{
    public class DocumentoAdjuntoMap : EntityTypeConfiguration<DocumentoAdjunto>
    {
        public DocumentoAdjuntoMap()
        {
            // Primary Key
            this.HasKey(t => t.IDDocumentoAdjunto);

            // Properties

            // Table & Column Mappings
            this.ToTable("DocumentoAdjunto");
            this.Property(t => t.IDDocumentoAdjunto).HasColumnName("IDDocumentoAdjunto");
            this.Property(t => t.IDOperacion).HasColumnName("IDOperacion");
            this.Property(t => t.IDAdjunto).HasColumnName("IDAdjunto");
            this.Property(t => t.IDComentarioMesaVirtual).HasColumnName("IDComentarioMesaVirtual");
            this.Property(t => t.EstadoDoctoAdjunto).HasColumnName("EstadoDoctoAdjunto");

            // Relationships
            this.HasOptional(t => t.Adjunto)
                .WithMany(t => t.DocumentoAdjuntoes)
                .HasForeignKey(d => d.IDAdjunto);
            this.HasOptional(t => t.MesaVirtualComentario)
                .WithMany(t => t.DocumentoAdjuntoes)
                .HasForeignKey(d => d.IDComentarioMesaVirtual);
            this.HasOptional(t => t.Operacion)
                .WithMany(t => t.DocumentoAdjuntoes)
                .HasForeignKey(d => d.IDOperacion);

        }
    }
}
