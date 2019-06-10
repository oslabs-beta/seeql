import { Client } from 'pg';

const URIStr =
  'postgres://ltdnkwnbccooem:64ad308e565b39cc070194f7fa621ae0e925339be5a1c69480ff2a4462eab4c4@ec2-54-163-226-238.compute-1.amazonaws.com:5432/ddsu160rb5t7vq';

const client = new Client(URIStr + '?ssl=true');

client.connect((err: string, res: string) => {
  if (err) {
    console.log(err, 'err conecting');
  } else {
    console.log('CONNECTED');
  }
});

export default client;
