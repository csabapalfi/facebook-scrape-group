const request = require('request-promise-native');


const GROUPS_URL = 'https://www.facebook.com/groups';

const getPage = async (uri, access_token) => 
  await request({uri, qs: {access_token}, json: true});

(async () => {
  const [,,groupid,access_token] = process.argv;
  let current = `https://graph.facebook.com/v6.0/${groupid}/feed`;
  try {
    while (current != null) {
      const {data, paging: {next}} = await getPage(current, access_token);
      data
        .map(({id, updated_time}) => ({
          date: updated_time,
          url: `${GROUPS_URL}/${id.split('_').join('/')}`
        }))
        .forEach(({date, url}) => {
          console.log(`${date},${url}`);
        });
      current = next;
    }
  } catch (error) {
    console.log(error.message || error)
  }
})();
