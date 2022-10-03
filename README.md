
&nbsp;
## The Problem

A new frontend application is being built to spec by a crack team of coders out in orbit around Eros. Hence they are rarely available and unable to negotiate any changes to an API specified below. The application renders and stores a tree of data.

Animals, an example of a tree;
*Note: This will be the first endpoint we test.*

```
1: root
    2: ant
    3: bear
        4: cat
        5: dog
            6: elephant
    7: frog
```

The format is a simple unique numeric id and alphanumeric label eg, `id: label`. Indentation indicates a child relationship. So, `1: root` has the children `2: ant, 3: bear, 7: frog`.

&nbsp;
## API Details and Challenge Tasks

For the first two tasks, persisting data in memory or simple files is adequate.

The service should run on, `http://localhost:3001/api/<end-point>` and the following end points should be available.
<br><br>

---
<br>

### 1. `GET /api/tree` return the entire tree - in the following format;

```
[
    {
        "<id>": {
            "label": "<first item>",
            "children": [
                {
                    "<id>": {
                        "label": "<another item>",
                        "children": [] // empty children
                    }
                },
                {
                    "<id>": {
                        "label": "<another item>",
                        "children": [ ...<any children>... ]
                    }
                }
            ]
        }
    }
]
```

#### Task 1

Add the route and return the data structure that represents the animals example above.
<br><br>

---
<br>

### 2. `POST /api/tree/` with the payload of the format

```
{
    "parent": "<id>",
    "label": "<label>"
}
```

Will cause a node to be added to the end of a list of children, a new unique id should be assigned by the service. The response should be simple.

#### Task 2

Implement the route, and ensure that a `GET /api/tree` request returns the updated tree.
<br><br>

---

<br>

### 3. Data persistance

This part __does not__ have to be implemented in code. Document the queries, methods, and decisions you would make if implementing. 
<br><br>

#### Task 3

Design a data schema for a database of your choice that would support the tree data above. 
<br><br>
#### Task 4

Write sample queries / code that would support the two routes that are detailed above.
