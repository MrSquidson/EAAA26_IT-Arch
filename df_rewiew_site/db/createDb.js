import { connect } from './connect.js';
import upload from 'pg-upload';

const db = await connect();
const timestamp = (await db.query('select now() as timestamp')).rows[0]['timestamp'];
console.log(`Recreating database on ${timestamp}...`);

const tables = [
    "saved_film",
    "saved_film_list",
    "reviews",
    "playlist_track",
    "playlists",
    "users",
    "tracks",
    "crew",
    "castings",
    "films",
    "genres",
    "media_types",
    "albums",
    "artists",
    "actors",
    "movies",
    "directors"
]

// drop all tables present in the list.
await tables.forEach(async (db_table) => {
    await db.query(`drop table if exists ${db_table}`);
    console.log(`Dropped table ${db_table}`);
});

// Create tables in the remote database

await db.query(`
    create table actors (
        actor_id    integer primary key,
        name        text not null,
        nationality char(2) not null
    )
`);
console.log(`Created table actors`);

await db.query(`
    create table directors (
        director_id     integer primary key,
        name            text not null
    )
`);
console.log(`Created table directors`);

await db.query(`
    create table genres (
        genre_id    integer primary key,
        name        text not null
    )
`);
console.log(`Created table genres`);

await db.query(`
    create table users (
        user_id          integer primary key,
        screen_name      text not null,
        email            text not null
    )
    `);
console.log(`Created table users`);
    
await db.query(`
    create table saved_film_list (
        list_id     integer primary key,
        list_name   text not null default 'My Favorites!',
        user_id     integer not null references users
    )
`);
console.log(`Created table saved_film_list`);

await db.query(`
    create table films (
        film_id integer primary key,
        title       text not null,
        genre_id    integer not null references genres,
        director_id integer not null references directors,
        year        integer not null
    )
`);
console.log(`Created table film`);

await db.query(`
        create table reviews (
        film_id         integer not null references films,
        user_id         integer not null references users,
        content         text,
        rating          integer not null,
        review_id       integer primary key
    )
`);
console.log(`Created table reviews`);

await db.query(`
    create table saved_film (
    film_id         integer not null references films,
    list_id         integer not null references saved_film_list
    )
`);
console.log(`Created table saved_film`);

await db.query(`
    create table crew (
        name          text not null,
        role          text not null default 'Stagehand',
        film_id       integer not null references films
    )
`);
console.log(`Created table crew`);

await db.query(`
    create table castings (
        film_id         integer not null references films,
        actor_id        integer not null references actors,
        role            text not null
    )
`);
console.log(`Created table castings`);




// Upload data from CSV files into the tables on remote

await upload(db, 'db/actors_2.csv',`
    copy actors (actor_id,name,nationality)
    from stdin
    with csv header encoding 'UTF-8'
`);
console.log(`Uploaded to table actors`);

await upload(db, 'db/directors.csv',`
    copy directors (director_id,name)
    from stdin
    with csv header encoding 'UTF-8'
`);
console.log(`Uploaded to table directors`);

await upload(db, 'db/genres.csv',`
    copy genres (genre_id,name)
    from stdin
    with csv header encoding 'UTF-8'
`);
console.log(`Uploaded to table genres`);

await upload(db, 'db/users.csv', `
    copy users (user_id,screen_name,email)
    from stdin
    with csv header encoding 'UTF-8'
`);
console.log(`Uploaded to table users`);

await upload(db, 'db/films_2.csv', `
    copy films (film_id,title,director_id,genre_id,year)
    from stdin
    with csv header encoding 'UTF-8'
`);
console.log(`Uploaded to table films`);

await upload(db, 'db/castings.csv', `
    copy castings (film_id,actor_id,role)
    from stdin
    with csv header encoding 'UTF-8'
`);
console.log(`Uploaded to table castings`);

await upload(db, 'db/reviews.csv', `
    copy reviews (film_id,user_id,content,rating,review_id)
    from stdin
    with csv header encoding 'UTF-8'
`);
console.log(`Uploaded to table reviews`);

await upload(db, 'db/saved_film_list.csv', `
    copy saved_film_list (list_id,list_name,user_id)
    from stdin
    with csv header encoding 'UTF-8'
`);
console.log(`Uploaded to table saved_film_list`);

await upload(db, 'db/saved_film.csv', `
    copy saved_film (film_id,list_id)
    from stdin
    with csv header encoding 'UTF-8'
`);
console.log(`Uploaded to table saved_film`);

await upload(db, 'db/crew.csv', `
    copy crew (name,role,film_id)
    from stdin
    with csv header encoding 'UTF-8'
`);
console.log(`Uploaded to table crew`);

await db.end();
console.log('Database successfully recreated.');