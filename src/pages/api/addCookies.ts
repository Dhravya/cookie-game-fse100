import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerAuthSession } from '~/server/auth'
import { db } from '~/server/db'

type Data = {
    success: boolean
}


export default async function NextAPI(req: NextApiRequest, res: NextApiResponse<Data>) {
    const cookies = req.query.cookies

    const session = await getServerAuthSession({ req, res })

    if (session) {
        console.log('session', session)
        // Update the user's cookies in the database=
        await db.user.update({
            where: { email: session.user.email! },
            data: { cookies: session.user.cookies + Number(cookies) },
        })

        session.user.cookies = cookies ? session.user.cookies + Number(cookies) : session.user.cookies

        res.status(200).json({ success: true })
        return
    }

    res.status(200).json({ success: false })
}