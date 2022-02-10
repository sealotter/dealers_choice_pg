const pg = require('pg')
const postgres =  process.env.DATABASE_URL || 'postgres://postgres:banana794@localhost/breweries'
const client = new pg.Client(postgres)

const syncAndSeed = async() =>{
    
    //brews dependent on company table-> order matters (can't drop company before brews)
    const SQL = `
    DROP TABLE IF EXISTS brews;
    DROP TABLE IF EXISTS company;


    CREATE TABLE company(
    id INTEGER PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    address VARCHAR(50) NOT NULL 
    );

    CREATE TABLE brews(
    id SERIAL PRIMARY KEY,

    brew_name VARCHAR(50) NOT NULL,
    type VARCHAR(50),
    about VARCHAR(1000) NOT NULL,
    company_id INTEGER REFERENCES company(id) NOT NULL
    );



    INSERT INTO company(id, name, address) VALUES(1,'Brewing Company', '400 Brown Cir');
    INSERT INTO company(id, name, address) VALUES(2, 'Barrel Brewing Co.', '62970 18th St');
    INSERT INTO company(id, name, address) VALUES(3, 'Bros and Barrels', '62950 NE 18th St');
    INSERT INTO company(id, name, address) VALUES(4, 'Bruster Brewing Co.', '490 Mill St');
    INSERT INTO company(id, name, address) VALUES(5, '12 Acres Brewing Company', '6820 Bourgeois Rd');

    INSERT INTO brews(brew_name, type, about, company_id) VALUES('Quis Nostrud', 'Quq Lite', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum', 2);


    INSERT INTO brews(brew_name, type, about, company_id) VALUES('Interdum Consectetur','Foo Dark', 'Magna fermentum iaculis eu non diam phasellus vestibulum lorem sed. Velit ut tortor pretium viverra suspendisse potenti. Rhoncus aenean vel elit scelerisque mauris pellentesque pulvinar pellentesque. Dictum non consectetur a erat nam. Nisl tincidunt eget nullam non nisi. Sit amet consectetur adipiscing elit pellentesque habitant morbi',1);

    INSERT INTO brews(brew_name, type, about, company_id) VALUES('Id Faucibus','Bar Ultra Lite', 'Amet venenatis urna cursus eget. Urna id volutpat lacus laoreet. Interdum consectetur libero id faucibus nisl tincidunt eget nullam. Aliquam etiam erat velit scelerisque. Id faucibus nisl tincidunt eget nullam non. Ornare arcu dui vivamus arcu felis bibendum ut tristique. Lorem mollis aliquam ut porttitor leo a diam sollicitudin. Interdum varius sit amet mattis vulputate enim nulla. Pretium lectus quam id leo in. Semper auctor neque vitae tempus quam pellentesque nec nam.', '3');

    INSERT INTO brews(brew_name, type, about, company_id) VALUES('Arcu Felis bibendum','Micro', 'dales ut etiam sit amet. Eget arcu dictum varius duis at consectetur lorem. Arcu felis bibendum ut tristique et. Sed sed risus pretium quam vulputate dignissim. Tincidunt dui ut ornare lectus sit amet est placerat in. Quam vulputate dignissim suspendisse in est ante in.', 4);

    INSERT INTO brews(brew_name, type, about, company_id) VALUES('Quam Vulputate', 'Foo', 'Tincidunt dui ut ornare lectus sit amet est placerat in. Quam vulputate dignissim suspendisse in est ante in. Est ullamcorper eget nulla facilisi etiam dignissim diam. Tempus egestas sed sed risus pretium quam. Sit amet nulla facilisi morbi tempus iaculis.', 4);

    INSERT INTO brews(brew_name, type, about, company_id) VALUES('Est Ullamcorper', 'Bazz','Lorem mollis aliquam ut porttitor leo a diam sollicitudin. Interdum varius sit amet mattis vulputate enim nulla. Pretium lectus quam id leo in. Semper auctor neque vitae tempus quam pellentesque nec nam.', 5);

    `;

    await client.query(SQL)


}

module.exports = {
    syncAndSeed,
    client

}