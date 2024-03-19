// import { Injectable, Logger } from '@nestjs/common';

// @Injectable()
// export class MyService {
//   private readonly logger = new Logger(MyService.name);

//   constructor() {}

//   myMethod() {
//     this.logger.log('Este es un mensaje de registro');
//     this.logger.warn('Este es un mensaje de advertencia');
//     this.logger.error('Este es un mensaje de error');
//   }
// }

// // Configure el logger para que muestre todos los mensajes por terminal
// const logger = new Logger();
// logger.setOptions({ timestamp: true, color: true });

// // Reemplace el logger por defecto con el logger configurado
// Logger.overrideLogger(logger);

// // Cree una instancia del servicio y ejecute el método
// const myService = new MyService();
// myService.myMethod();
