import { redirect } from 'next/navigation';

export default function Index() {
    // '/home' route is the default page
    redirect('/home');
}