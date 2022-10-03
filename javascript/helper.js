var db = require("./database.js")

// holds the database values for animal Tree
let treeData = null;

//Recursive function used to get the children of the root animal
const fetchChildren = (childId, childrenIDs, relativesTested) => {
  if (relativesTested.includes(childId)) {
    return null;
  }
  let grandChild = treeData.find((parent) => childId == parent.animal_id)
  grandChild.children = [];
  let animals = treeData.filter((value) => childId == value.parent_id)
  const grandKids = animals.map(animal => animal.animal_id)

  if (grandKids) {
    grandKids.forEach(kid => {
      const childIdData = fetchChildren(kid, grandKids, relativesTested);
      if (childIdData !== null) {
        grandChild.children.push({
          [childIdData.animal_id]: {
            label: childIdData.label,
            children: childIdData.children
          }
        });
      }
      relativesTested.push(kid)
    })
  }
  relativesTested.push(childId)
  return grandChild;
}

const tree = async function () {
  //Gets all animals from the tree
  treeData = await new Promise((resolve, reject) => {
    const sql = `SELECT * FROM animaltree`;
    db.all(sql, [], (err, rows) => {
      if (err) {
        console.error(err.message)
        reject(err);
      }
      resolve(rows)
    });
  });
  if (treeData.length === 0) {
    return [];
  }

  //root animals parent_id will always be zero and there can only be one root
  const rootAnimal = await new Promise((resolve, reject) => {
    const sql = `SELECT * FROM animaltree WHERE parent_id = 0`;
    db.get(sql, [], (err, rows) => {
      if (err) {
        console.error(err.message)
        reject(err);
      }
      resolve(rows)
    });
  });

  let animals = treeData.filter(({
    parent_id
  }) => parent_id == rootAnimal.animal_id)
  // Gets the top level children of the root animal
  const childrenIDs = animals.map(animal => animal.animal_id)
  let children = [];
  animals.forEach(animal => {
    // recursive  function to children of the root animal
    let response = fetchChildren(animal.animal_id, childrenIDs, [])
    if (response.children.length) {
      children.push({
        [animal.animal_id]: {
          label: animal.label,
          children: response.children
        }
      })
    } else {
      children.push({
        [animal.animal_id]: {
          label: animal.label,
          children: []
        }
      })
    }
  })
  let animalTree = '[' + JSON.stringify({
    [rootAnimal.animal_id]: {
      label: rootAnimal.label,
      children: children
    }
  }) + ']';
  return animalTree;
}

const addAnimal = async function (parent_id, label) {
  if (parent_id == 0) {
    const rootExists = await new Promise((resolve, reject) => {
      const sql = `SELECT * FROM animaltree WHERE parent_id = 0`;
      db.get(sql, [], (err, rows) => {
        if (err) reject(err);
        resolve(rows)
      });
    });
    // return error if root animal already exists
    if (rootExists) {
      return {
        message: 'Root animal was already created',
        status: 400
      };
    }
  }
  const parentIDExists = await new Promise((resolve, reject) => {
    const sql = `SELECT * FROM animaltree WHERE animal_id = ?`;
    db.get(sql, [parent_id], (err, rows) => {
      if (err) return reject(err);
      resolve(rows)
    });
  });
  if (!parentIDExists && parent_id !== 0) {
    return {
      message: 'Parent Id doesnt exists',
      status: 400
    };
  } else {
    await new Promise((resolve, reject) => {
      db.run(`INSERT INTO animaltree(parent_id,label) VALUES (?,?)`, [parent_id, label], function (err) {
        if (err) return reject(err);
        resolve(this.lastID)
      });
    });
    return {
      message: 'Success',
      status: 200
    }
  }
}


// truncates the animaltree table in the database
const resetAnimalTree = async function () {
  await new Promise((resolve, reject) => {
    db.run(`DELETE FROM animaltree`, function (err) {
      if (err) return reject(err);
    });
    db.run(`UPDATE sqlite_sequence SET seq=0 WHERE name='animaltree'`, function (err) {
      if (err) return reject(err);
      resolve(this.lastID)
    });
  });
  return {
    message: 'Success',
    status: 200
  }
}
//Initialize the Animal tree using deafult data
const initiateTree = async function () {
  const initialValues = [ 
     [0,'root'],
     [1,'ant'],
     [1,'bear'],
     [3,'cat'],
     [3,'dog'],
     [5,'elephant'],
     [1,'frog']
  ];

  let statement = db.prepare('INSERT INTO animaltree(parent_id,label) VALUES (?,?)');
  await new Promise((resolve, reject) => {
    for (const item of initialValues){
      statement.run(item, function (err) {
        if (err) return reject(err);
      });
    }
    resolve(statement.finalize());
  });
  return {
    message: 'Success',
    status: 200
  }
}

module.exports = {
  addAnimal,
  tree,
  resetAnimalTree,
  initiateTree,
}