import { Global, Module } from '@nestjs/common';
import { HashService } from './services/hash.service';

@Global() // ✅ Hace que HashService esté disponible globalmente
@Module({
  providers: [HashService],
  exports: [HashService],
})
export class CommonModule {}