import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotesModule } from './notes/notes.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        retryAttempts: configService.get<number>('MONGODB_RETRY_ATTEMPTS', 5),
        retryDelay: configService.get<number>('MONGODB_RETRY_DELAY', 3000),
        // Additional robust configuration
        connectionFactory: (connection) => {
          connection.on('connected', () => {
            console.log('MongoDB connected successfully');
          });
          connection.on('error', (error) => {
            console.error('MongoDB connection error:', error);
          });
          return connection;
        },
        // Add more MongoDB specific options
        serverSelectionTimeoutMS: 5000,
        heartbeatFrequencyMS: 10000,
      }),
    }),
    NotesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}