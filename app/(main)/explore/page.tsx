import type { Metadata } from 'next';
import { ExplorePage } from '../../../components/explore/ExplorePage';

export const metadata: Metadata = { title: 'Explore' };
export default function Page() { return <ExplorePage />; }
