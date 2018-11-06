import "isomorphic-fetch";

const listAllDroneLocations = async () => {
  // Using the create-react-app's proxy for CORS issues
  const response = await fetch(
    `https://react-assessment-api.herokuapp.com/api/drone`
  );
  if (!response.ok) {
    return { error: { code: response.status } };
  }
  const json = await response.json();
  json.data = json.data.filter(function(d) { return d.accuracy > 80; })
  // console.log(json);
  return { data: json};
};

export default listAllDroneLocations;
