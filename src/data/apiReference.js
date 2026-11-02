// Native OpenAPI is imported byte-for-byte by scripts/import-native-contracts.mjs.
import nativeSpec from '@site/static/native/openapi.json';

const belongsTo = path => {
  if (/\/(?:agents|agent_|bridge|library|artefacts|feedbacks|mutters|memories|conversations|presets|agent_presets)(?:\/|_|$)/.test(path)) return 'agents';
  if (/\/(?:webhooks?|webhook_endpoints|git_connections|github|gitea|team_git_installations|oauth|provider|api_keys|secrets|vault|job_env|automation_env|audit|audit_logs)(?:\/|_|$)/.test(path)) return 'integrations';
  return 'platform';
};

function displayTag(path) {
  const resource = path.replace(/^\/(?:api|ui-api|admin-api)(?:\/v\d+)?\//, '').split('/')[0];
  const names = {
    hosts: 'Hosts', specs: 'Specs', repositories: 'Repositories', playgrounds: 'Playgrounds',
    tasks: 'Tasks', agents: 'Agents', agent_presets: 'Agent Presets',
    artefacts: 'Library Artefacts', feedbacks: 'Library Feedback', mutters: 'Library Mutters',
    api_keys: 'API Keys', audit_logs: 'Audit Logs', teams: 'Teams', env_packs: 'ENV Packs',
    import_templates: 'Templates', webhook_endpoints: 'Webhooks', git_connections: 'Git Connections',
  };
  return names[resource] || resource.replaceAll('_', ' ').replace(/\b\w/g, letter => letter.toUpperCase()) || 'Installation';
}

function section(name, title) {
  return [{
    title,
    // Keep schemas, security, parameters and response contracts exactly as generated.
    spec: {
      ...nativeSpec,
      paths: Object.fromEntries(Object.entries(nativeSpec.paths)
        .filter(([path]) => belongsTo(path) === name)
        .map(([path, operations]) => [path, Object.fromEntries(Object.entries(operations)
          .map(([method, operation]) => [method, {...operation, tags: [displayTag(path)]}]))])),
    },
  }];
}

export const platformSections = section('platform', 'Native platform API');
export const agentsSections = section('agents', 'Agents and Library API');
export const integrationsSections = section('integrations', 'Integrations API');
