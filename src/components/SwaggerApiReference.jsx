import React, {useMemo} from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import styles from './SwaggerApiReference.module.css';

export default function SwaggerApiReference({sections}) {
  const spec = useMemo(() => ({
    ...sections[0].spec,
    info: {
      ...sections[0].spec.info,
      title: sections[0].title,
      description: 'Committed Native self-hosted contract. Public /api routes use Bearer credentials; /ui-api and /admin-api routes require browser authentication and the guards shown in the contract. Route registration does not establish end-to-end qualification.',
    },
    servers: [{
      url: '{origin}',
      description: 'Your self-hosted FIBE installation',
      variables: {origin: {default: 'https://fibe.example', description: 'Replace with your installation origin, without a trailing slash.'}},
    }],
  }), [sections]);

  return (
    <div className={styles.root}>
      <div className={styles.instructions}>
        <strong>Use your installation:</strong> set <code>origin</code> to your self-hosted FIBE URL. For Bearer endpoints, click <strong>Authorize</strong> and enter your API key. Browser-only routes need their documented session, CSRF and recent-auth checks. Cross-origin requests also require your installation to allow this guide’s origin. Swagger UI generates curl commands for terminal use.
      </div>
      <SwaggerUI
        spec={spec}
        tryItOutEnabled
        persistAuthorization={false}
        docExpansion="none"
        defaultModelsExpandDepth={-1}
        deepLinking
        displayRequestDuration
      />
    </div>
  );
}
