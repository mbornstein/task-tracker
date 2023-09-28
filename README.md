# Task Tracker

This task tracker is built on top of [Airsequel](https://www.airsequel.com/).
It uses 1 table and 2 views (see getting started section).

The design principle for this time tracker is a simple design
and fast and frictionless time tracking,
so users can enter data with few clicks right when they change tasks.
Storing this in an Airsequel / SQLite database
makes with data easily available for analysis tools of choice
and data can be stored and move wherever it is best.
The schema only stores start times, so the whole time line is considered tracked,
whereas unproductive time is labeled a special activity called "Pause" in my case.

![screenshot](example/screenshot.png)

The UI has the following functionality:

* Selecting a previous entry will populate the form at the top
    (like copy&paste, this can be considered *resuming* a task)
* Clicking a 10 minute cell will create a task entry
    with start time of the cell in the DB
* Clicking **Start** will create the activity now
* Clicking **Pause** will create a Pause entry now
* Switching the current day or number of days shown, modifies the calendar view


## Getting Started

Create a copy of our template database via following link:
[Create Copy](https://www.airsequel.com/readonly/93yd8ashnx154d1m/duplicate)

<details>
  <summary>Show full SQL schema</summary>

  ```sql
  CREATE TABLE "activity" (
    "rowid" INTEGER PRIMARY KEY,
    "title" TEXT,
    "comment" TEXT,
    "project" TEXT,
    "type" TEXT,
    "link" TEXT,
    "start" TEXT
  );

  CREATE VIEW "projects" AS
  SELECT DISTINCT "project"
  FROM "activity"
  WHERE "project" IS NOT NULL;

  CREATE VIEW "types" AS
  SELECT DISTINCT "type"
  FROM "activity"
  WHERE "type" IS NOT NULL;
  ```
</details>
</br>

To run this on top of your own database use the corresponding URL like:

`http://localhost:8080/?baseurl=TODO&dbid=TODO`

- The `baseurl` could e.g. be `https://www.airsequel.com`
    (default is `http://localhost:4158`)
- The database ID can be copied from your database URL


### Development

Run `npm install && npm start` to run the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.


### Deployment

Run `npm install && npm run build` to build the app for production
and copy it to the `dist` directory.\
It correctly bundles React in production mode
and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about
[deployment](https://facebook.github.io/create-react-app/docs/deployment)
for more information.


## Analysis Of The Data

Using Airsequel's database UI and SQLite queries,
the data can easily be analyzed.

![analysis](example/analysis.png)

Since we only track start times,
it is a good idea to create a clean and enriched view of the activity data.
The following query computes the end times and duration of tasks
and removes unproductive time (Pause).

```sql
CREATE VIEW activity_enriched AS
SELECT
  *,
  (
    unixepoch(datetime(finish))
    - unixepoch(datetime(start))
  ) / 60 as duration_min
FROM (
  SELECT
    *,
    lead("start", 1) OVER
      (ORDER BY start RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)
      AS finish
  FROM activity
)
WHERE title != "Pause"
```

With this, we can aggregate the share of time per type of activity each week like so:

```sql
CREATE VIEW time_per_type AS
SELECT
  a.*,
  b.*,
  round(cast(a.min AS float) / b.total * 100.0, 1) AS perc
FROM
(
SELECT
  datetime(start, "weekday 0", "-7 days", "start of day") AS week,
  sum(duration_min) AS min,
  type
FROM activity_enriched
group by type, week
) AS a
LEFT JOIN
(
SELECT
  datetime(start, "weekday 0", "-7 days", "start of day") AS week,
  sum(duration_min) AS total
FROM activity_enriched
GROUP BY week
) AS b
USING (week)
ORDER BY week ASC, min DESC, type
```
