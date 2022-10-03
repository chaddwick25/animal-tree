var helper = require("./helper.js");

test('Reset the animaltree table within the Database', async() => {  
  const reset = await helper.resetAnimalTree();
  expect(reset.status).toBe(200);
});

test('Failed to add root animal to the animaltree table', async() => {  
    //"root" entry's parent_id must be 0  
  const reset = await helper.addAnimal(45, 'fox');
  expect(reset.status).toBe(400);
});

test('Successfully added the root animal to the animaltree table', async() => { 
  //No users exists within the table therefore "root" entry parent_id must be 0  
  const reset = await helper.addAnimal(0, 'root');
  expect(reset.status).toBe(200);
});

test(`Failed to add "fox" animal to database`, async() => {  
  //parent_id must be an available primary key within the table
  const reset = await helper.addAnimal(45, 'fox');
  expect(reset.status).toBe(400);
});

test('Successfully added the second animal to the animaltree table', async() => {  
  const reset = await helper.addAnimal(1, 'fox');
  expect(reset.status).toBe(200);
});

test('Successfully testing the initialTree', async() => {  
  // initializes the Animal Tree based on Task 1 
  // source: https://github.com/Hinge-Health-Recruiting/interviews-services_chaddwick25
  const reset = await helper.resetAnimalTree();
  if(reset.status === 200 ){
    const initiateTree = await helper.initiateTree();
    expect(initiateTree.status).toBe(200)
  }
});
