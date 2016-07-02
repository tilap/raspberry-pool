export default function buildRouter(builder) {
    builder
        .add('home', '/', 'raspberries.index')
        .add('screenshot', '/screenshot', 'raspberries.screenshot', { extension: 'jpg' })
        .add('installScript', '/install-scripts/${scriptName}', 'install.script', { extension: 'sh' })
        .add('default', '/${controller}', 'site.index', { extension: 'html' });
}
