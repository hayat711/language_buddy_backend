import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";


@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'containers-us-west-64.railway.app',
            port: 7538,
            username: 'postgres',
            password: 'C6nYmFm8HViBNkagDXmg',
            database: 'railway',
            autoLoadEntities: true,
            synchronize: true,
        })
    ],
})

export class DatabaseModule {}