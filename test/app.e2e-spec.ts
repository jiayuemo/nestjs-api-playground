import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from 'src/auth/dto';

describe('App e2e suite', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    // Create Testing Module and App then initialize
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication({});
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3333);
    // Clean up the database in between e2e suite runs
    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    // Configure pactum spec testing client
    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    describe('Signup', () => {
      const signupDTO: AuthDto = {
        email: 'homer@gmail.com',
        password: '123',
      };

      it('should throw 400 if email is empty', () => {
        const invalidDTO: AuthDto = {
          ...signupDTO,
          email: '',
        };
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(invalidDTO)
          .expectStatus(400);
      });

      it('should throw 400 if password is empty', () => {
        const invalidDTO: AuthDto = {
          ...signupDTO,
          password: '',
        };
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(invalidDTO)
          .expectStatus(400);
      });

      it('should throw 400 if no body provided', () => {
        return pactum.spec().post('/auth/signup').expectStatus(400);
      });

      it('should signup with 201', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(signupDTO)
          .expectStatus(201);
      });
    });

    describe('Signin', () => {
      const signinDTO: AuthDto = {
        email: 'homer@gmail.com',
        password: '123',
      };

      it('should throw 400 if email is empty', () => {
        const invalidDTO: AuthDto = {
          ...signinDTO,
          email: '',
        };
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(invalidDTO)
          .expectStatus(400);
      });

      it('should throw 400 if password is empty', () => {
        const invalidDTO: AuthDto = {
          ...signinDTO,
          password: '',
        };
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(invalidDTO)
          .expectStatus(400);
      });

      it('should throw 400 if no body provided', () => {
        return pactum.spec().post('/auth/signup').expectStatus(400);
      });

      it('should throw 403 if incorrect credentials provided', () => {
        const invalidDTO: AuthDto = {
          email: 'nothomer@gmail.com',
          password: '123',
        };
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(invalidDTO)
          .expectStatus(403);
      });

      it('should signin with 200', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(signinDTO)
          .expectStatus(200)
          .stores('userAccessToken', 'access_token');
      });
    });
  });

  describe('User', () => {
    describe('Get me', () => {
      it('should throw 401 if no auth headers provided', () => {
        return pactum.spec().get('/users/me').expectStatus(401);
      });

      it('should throw 401 if incorrect auth headers provided', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: `Bearer somerandomtoken`,
          })
          .expectStatus(401);
      });

      it('should get current user with 200', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: `Bearer $S{userAccessToken}`,
          })
          .expectStatus(200);
      });
    });

    describe('Edit user', () => {
      it.todo('should edit a user');
    });
  });

  describe('Bookmarks', () => {
    describe('Create bookmark', () => {
      it.todo('should create a bookmark');
    });

    describe('Get bookmarks', () => {
      it.todo('should get a bookmark');
    });

    describe('Get bookmark by id', () => {
      it.todo('should get bookmark by id');
    });

    describe('Edit bookmark by id', () => {
      it.todo('should edit bookmark');
    });

    describe('Delete bookmark by id', () => {
      it.todo('should delete the bookmark');
    });
  });
});
