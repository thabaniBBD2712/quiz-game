import Provider from 'oidc-provider';

export const oidc = (issuer, configuration) => {
    return new Provider(issuer, configuration);
};