var ftpd = require('./ftpmult.js');
const NAMESPACE = process.env.NAMESPACE || 'clonix';

try {
    process.setuid(65534);
    process.setgid(65534);
} catch (e) {
}

var server = new ftpd.FtpServer({
    getHostFromUsername: function(username) {
		
        const parts = username.split('.');

        if (parts.length !== 2) {
            console.log(`Usuario invalido`);
            return null;
        }

        const [sitename, user] = parts;

        const targetHost = `${sitename}-${sitename}.${NAMESPACE}.svc.cluster.local`;
        const targetPort = 2121;

        return {hostname: targetHost, port: targetPort};
    }
});

server.logLevel = 4;
server.listen(2121);
server.server.on("error", function() {
    /* better exit so that someone can restart us */
    process.exit(1);
});
