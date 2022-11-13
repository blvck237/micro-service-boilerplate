import { Strategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import * as passport from 'passport';
import { UserRepository } from '@repositories/user.repository';

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  ignoreExpiration: false,
};

const jwtAuth = (opts: StrategyOptions, userRepository: UserRepository) =>
  new Strategy(opts, async (jwtPayload, done) => {
    try {
      const user = await userRepository.getOne({ _id: jwtPayload._id });
      if (!user) {
        return done(null, false, { message: 'ERROR__INVALID_PASSWORD' });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  });

export const initPassportStrategies = (userRepository: UserRepository) => {
  passport.use(
    'JWT_User',
    jwtAuth(
      {
        secretOrKey: process.env.JWT_SECRET_USER,
        ...options,
      },
      userRepository
    )
  );

  passport.use(
    'JWT_Admin',
    jwtAuth(
      {
        secretOrKey: process.env.JWT_SECRET_ADMIN,
        ...options,
      },
      userRepository
    )
  );

  passport.use(
    'JWT_Refresh',
    jwtAuth(
      {
        secretOrKey: process.env.JWT_SECRET_REFRESH,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: true,
      },
      userRepository
    )
  );
};
