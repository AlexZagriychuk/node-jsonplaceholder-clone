import { IAlbum } from "../models/album"
import { IComment } from "../models/comment"
import { IPhoto } from "../models/photo"
import { IPost } from "../models/post"
import { ITodo } from "../models/todo"
import { IUser, UserType } from "../models/user"
import { jsonplaceholderAlbums, jsonplaceholderComments, jsonplaceholderPhotos, jsonplaceholderPosts, jsonplaceholderTodos, jsonplaceholderUsers } from "./jsonplaceholderData"
import { renameObjKey } from "./object"


export function generateUsers(): Array<IUser> {
    // Modify / add extra data on top of the original jsonplaceholder data
    const users = addExtraUsersData(jsonplaceholderUsers)

    return renameId(users)
}

export function generatePosts(): Array<IPost> {
    // Modify / add extra data on top of the original jsonplaceholder data
    const posts = addExtraPostsData(jsonplaceholderPosts)

    return renameId(posts)
}

export function generateTodos(): Array<ITodo> {
    return renameId(jsonplaceholderTodos)
}

export function generateAlbums(): Array<IAlbum> {
    return renameId(jsonplaceholderAlbums)
}

export function generatePhotos(): Array<IPhoto> {
    return renameId(jsonplaceholderPhotos)
}

export function generateComments(): Array<IComment> {
    return renameId(jsonplaceholderComments)
}

//---------------------------------------------------------------------
//---------------- processing jsonplaceholder data --------------------
//---------------------------------------------------------------------
// Rename id into _id for all elements in array
function renameId(objs: Array<Object>) {
    return objs.map(obj => renameObjKey(obj, "id", "_id"))
}

// Generate fake createdAt dates for all posts
function addExtraPostsData(postsData: any[]): IPost[] {
    const postsLength = postsData.length;

    const generatedDates = generateDates(postsLength, new Date(), DateUnit.HOUR, -1);
    postsData.forEach((post, index) => { post.createdAt = generatedDates[postsLength - index - 1] });

    return postsData;
}

// 1. Replace first user with our fake Admin user
// 2. Add fake avatar to all fetched users
// 3. Add fake user registration date (registered)
function addExtraUsersData(usersData: any[]): IUser[] {
    const usersCount = usersData.length

    let oneYearFromNowInThePast = new Date();
    oneYearFromNowInThePast.setFullYear(oneYearFromNowInThePast.getFullYear() - 1);
    const fakeRegistrationDates = generateDates(usersCount, oneYearFromNowInThePast, DateUnit.DAY, -30)

    const users = usersData.map((userData: any, index) => {
        let fakeUserRegistrationDate = fakeRegistrationDates[usersCount - index - 1]
        const userId = userData.id

        if (index === 0) {
            // Replace first user with the fake admin user
            return getFakeAdminUser(userId, fakeUserRegistrationDate)
        } else {
            // Add extra data for 2nd+ users
            return {
                ...userData,
                type: UserType.WRITER,
                avatarSmall: `https://picsum.photos/id/${userId * 10}/300/200`,
                avatarBig: `https://picsum.photos/id/${userId * 10}/900/600`,
                registered: fakeUserRegistrationDate
            } as IUser
        }
    })

    return users
}

function getFakeAdminUser(userId = 1, registered: Date): IUser {
    return {
        _id: userId,
        name: "Michael Scott",
        username: "Michael_Scott_Best_Admin",
        type: UserType.ADMIN,
        avatarBig: "https://i.pinimg.com/originals/b3/60/dc/b360dc361dc57c0524e61d9a92b9ad26.jpg",
        avatarSmall: "https://i.pinimg.com/originals/b3/60/dc/b360dc361dc57c0524e61d9a92b9ad26.jpg",
        registered: registered,
        email: "michael_scott@dunder.mifflin.com",
        address: {
            street: "Slough Avenue",
            suite: "1725",
            city: "Scranton, PA",
            zipcode: "18505-7427",
            geo: {
                lat: "41.411835",
                lng: "-75.665245"
            }
        },
        phone: "1-999-123-4567",
        website: "https://dundermifflinpaper.com/",
        company: {
            name: "Dunder Mifflin Paper Company, Inc",
            catchPhrase: "Limitless Paper in a Paperless World",
            bs: "We provide you the highest quality paper, the best possible service, at the lowest possible prices"
        }
    };
};

enum DateUnit {
    SECOND = 1000,
    MINUTE = 1000 * 60,
    HOUR = 1000 * 60 * 60,
    DAY = 1000 * 60 * 60 * 24
}

function getRandomDate(startDate: Date, endDate: Date) {
    const timeDiff = endDate.getTime() - startDate.getTime();
    const randomTime = Math.random() * timeDiff;
    const randomDate = new Date(startDate.getTime() + randomTime);
    return randomDate
}

// Generate specified number ${datesToGenerateCount} of random dates in chronological order with the specified step range (1 hour by default):
// - 1st date = random date between firstDateOfRange and firstDateOfRange-1 hour (if datesRangeStep is default); 
// - 2nd date = random date between firstDateOfRange-1 hour and firstDateOfRange-2 hours (if datesRangeStep is default);
// - and so on... 
function generateDates(datesToGenerateCount: number, firstDateOfRange: Date, datesRangeStepUnit: DateUnit, datesRangeStepValue: number): Date[] {
    const result = Array(datesToGenerateCount) as Date[]
    const dateStepRangeInMs = datesRangeStepUnit * datesRangeStepValue

    for (let i = 0; i < datesToGenerateCount; i++) {
        let secondDateOfRange = new Date(firstDateOfRange.getTime() + dateStepRangeInMs)
        result[i] = getRandomDate(secondDateOfRange, firstDateOfRange)
        firstDateOfRange = secondDateOfRange
    }

    return result
}
