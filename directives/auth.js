import { SchemaDirectiveVisitor } from 'apollo-server-express';
import { defaultFieldResolver } from 'graphql';
import { authCheck } from '../scripts/auth-check';

class AuthDirective extends SchemaDirectiveVisitor {
   visitFieldDefinition(field) {
      const { resolve = defaultFieldResolver } = field;
      const { role } = this.args;

      field.resolve = function (...args) {
         const [, , context] = args;
         authCheck(context.req, role);
         return resolve.apply(this, args);
      }
   }
}

export default AuthDirective;