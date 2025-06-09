var ftpd = require('./ftpmult.js');
const NAMESPACE = process.env.NAMESPACE || 'clonix';
const os = require('os');

try {
    process.setuid(65534);
    process.setgid(65534);
} catch (e) {
}
var localip;

const interfaces = os.networkInterfaces();
for (const name in interfaces) {
  for (const iface of interfaces[name]) {
    if (iface.family === 'IPv4' && !iface.internal) {
      console.log(`IP local (${name}): ${iface.address}`);

      localip = iface.address;
    }
  }
}

var server = new ftpd.FtpServer({
    host: localip,
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
server.host = localip;
server.logLevel = 4;
server.listen(2121);
server.server.on("error", function() {
    /* better exit so that someone can restart us */
    process.exit(1);
});
