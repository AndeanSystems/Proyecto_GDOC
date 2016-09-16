﻿using System;
using System.Collections.Generic;

namespace Gdoc.Entity.Models
{
    public partial class DocumentoAdjunto
    {

        public long IDDocumentoAdjunto { get; set; }
        public Nullable<long> IDOperacion { get; set; }
        public Nullable<long> IDAdjunto { get; set; }
        public Nullable<long> IDComentarioMesavirtual { get; set; }
        public string TipoDoctoAdjunto { get; set; }
        public Nullable<int> EstadoDoctoAdjunto { get; set; }
        public virtual Operacion Operacion { get; set; }

        public virtual Adjunto Adjunto { get; set; }

        public virtual ICollection<Adjunto> Adjuntoes { get; set; }
    }
}
