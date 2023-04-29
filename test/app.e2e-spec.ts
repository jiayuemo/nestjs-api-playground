import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from 'src/auth/dto';
import { EditUserDto } from 'src/user/dto';
import { CreateBookmarkDTO, EditBookmarkDTO } from 'src/bookmark/dto';

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

      it('should signup with 201 if valid body', () => {
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

      it('should signin with 200 if valid body', () => {
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
            Authorization: 'Bearer somerandomtoken',
          })
          .expectStatus(401);
      });

      it('should get current user with 200 if valid headers', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}',
          })
          .expectStatus(200);
      });
    });

    describe('Edit user', () => {
      const editUserDTO: EditUserDto = {
        firstName: 'Homer',
        lastName: 'Simpson',
      };

      it('should throw 401 if no auth headers provided', () => {
        return pactum.spec().patch('/users').expectStatus(401);
      });

      it('should throw 401 if incorrect auth headers provided', () => {
        return pactum
          .spec()
          .patch('/users')
          .withHeaders({
            Authorization: 'Bearer somerandomtoken',
          })
          .expectStatus(401);
      });

      it('should edit a user with 200 if valid headers and body', () => {
        return pactum
          .spec()
          .patch('/users')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}',
          })
          .withBody(editUserDTO)
          .expectStatus(200)
          .expectBodyContains(editUserDTO.firstName)
          .expectBodyContains(editUserDTO.lastName);
      });
    });
  });

  describe('Bookmarks', () => {
    describe('Get bookmarks', () => {
      it('should throw 401 if no auth headers provided', () => {
        return pactum.spec().get('/bookmarks').expectStatus(401);
      });

      it('should throw 401 if incorrect auth headers provided', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer somerandomtoken',
          })
          .expectStatus(401);
      });

      it('should get bookmarks with 200 if valid headers', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}',
          })
          .expectStatus(200);
      });
    });

    describe('Create bookmark', () => {
      const createBookmarkDto: CreateBookmarkDTO = {
        title: 'First Bookmark',
        description: 'homepage',
        link: 'www.google.com',
      };

      it('should throw 401 if no auth headers provided', () => {
        return pactum.spec().post('/bookmarks').expectStatus(401);
      });

      it('should throw 401 if incorrect auth headers provided', () => {
        return pactum
          .spec()
          .post('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer somerandomtoken',
          })
          .expectStatus(401);
      });

      it('should throw 400 if invalid link provided in body', () => {
        return pactum
          .spec()
          .post('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}',
          })
          .withBody({
            ...createBookmarkDto,
            link: 'invalidLink',
          })
          .expectStatus(400);
      });

      it('should create a bookmark with 201 if valid headers and body', () => {
        return pactum
          .spec()
          .post('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}',
          })
          .withBody(createBookmarkDto)
          .expectStatus(201)
          .stores('bookmarkId', 'id');
      });
    });

    describe('Get bookmark by id', () => {
      it('should throw 401 if no auth headers provided', () => {
        return pactum
          .spec()
          .get('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .expectStatus(401);
      });

      it('should throw 401 if incorrect auth headers provided', () => {
        return pactum
          .spec()
          .get('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer somerandomtoken',
          })
          .expectStatus(401);
      });

      it('should throw 404 if valid headers but bookmark d/n exist', () => {
        return pactum
          .spec()
          .get('/bookmarks/{id}')
          .withPathParams('id', '10000')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}',
          })
          .expectStatus(404);
      });

      it.todo(
        'should throw 404 if valid headers and bookmark exist but bookmark not owned by calling user',
      );

      it('should get bookmark by id with 200 if valid headers and param', () => {
        return pactum
          .spec()
          .get('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}',
          })
          .expectStatus(200)
          .expectBodyContains('$S{bookmarkId}');
      });
    });

    describe('Edit bookmark by id', () => {
      const editBookmarkDTO: EditBookmarkDTO = {
        description: 'homepage edit',
        link: 'www.yahoo.com',
      };

      it('should throw 401 if no auth headers provided', () => {
        return pactum
          .spec()
          .patch('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .expectStatus(401);
      });

      it('should throw 401 if incorrect auth headers provided', () => {
        return pactum
          .spec()
          .patch('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer somerandomtoken',
          })
          .expectStatus(401);
      });

      it('should throw 400 if invalid link provided in body', () => {
        return pactum
          .spec()
          .patch('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}',
          })
          .withBody({
            ...editBookmarkDTO,
            link: 'invalidLink',
          })
          .expectStatus(400);
      });

      it.todo('should throw 404 if bookmark d/n exist');

      it.todo(
        'should throw 404 if bookmark exists but not owned by calling user',
      );

      it('should edit bookmark with 200 if valid headers and body', () => {
        return pactum
          .spec()
          .patch('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}',
          })
          .withBody(editBookmarkDTO)
          .expectStatus(200)
          .expectBodyContains(editBookmarkDTO.description)
          .expectBodyContains(editBookmarkDTO.link);
      });
    });

    describe('Delete bookmark by id', () => {
      it('should throw 401 if no auth headers provided', () => {
        return pactum
          .spec()
          .delete('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .expectStatus(401);
      });

      it('should throw 401 if incorrect auth headers provided', () => {
        return pactum
          .spec()
          .delete('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer somerandomtoken',
          })
          .expectStatus(401);
      });

      it.todo('should throw 404 if bookmark d/n exist');

      it.todo(
        'should throw 404 if bookmark exists but not owned by calling user',
      );

      it('should delete the bookmark with 204 if valid headers and param id', () => {
        return pactum
          .spec()
          .delete('/bookmarks/{id}')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}',
          })
          .withPathParams('id', '$S{bookmarkId}')
          .expectStatus(204);
      });
    });
  });
});
