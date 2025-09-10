import { Test } from '@nestjs/testing';
import { AppModule } from './../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as pactum from 'pactum';
import { AuthDto } from 'src/auth/dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3000);
    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3000');
  });
  afterAll(() => {
    app.close();
  });
  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'test@example.com',
      password: 'password',
    };
    describe('Signup', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ password: dto.password })
          .expectStatus(400)
          .inspect();
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ email: dto.email })
          .expectStatus(400)
          .inspect();
      });
      it('should throw if body no provided', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({})
          .expectStatus(400)
          .inspect();
      });
      it('should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201)
          .inspect();
      });

      describe('Signin', () => {
        it('should signin', () => {
          return pactum
            .spec()
            .post('/auth/signin')
            .withBody(dto)
            .expectStatus(200)
            .inspect();
        });
        it('should throw if email empty', () => {
          return pactum
            .spec()
            .post('/auth/signin')
            .withBody({ password: dto.password })
            .expectStatus(400)
            .inspect();
        });
        it('should throw if password empty', () => {
          return pactum
            .spec()
            .post('/auth/signin')
            .withBody({ email: dto.email })
            .expectStatus(400)
            .inspect();
        });
        it('should throw if body no provided', () => {
          return pactum
            .spec()
            .post('/auth/signin')
            .withBody({})
            .expectStatus(400)
            .inspect();
        });
      });
    });
    describe('User', () => {
      describe('Get me', () => {});

      describe('Edit user', () => {});
    });
    describe('Bookmark', () => {
      describe('Create bookmark', () => {});

      describe('Get bookmarks', () => {});

      describe('Edit bookmark', () => {});

      describe('Delete bookmark', () => {});
    });

    it.todo('should pass');
  });
});
