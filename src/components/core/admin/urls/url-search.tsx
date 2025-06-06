'use client';

import { Search, X } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface UrlSearchProps {
  initialSearch: string;
}

export function UrlSearch({ initialSearch }: UrlSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [search, setSearch] = useState(initialSearch);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams(searchParams.toString());

    // reset to first page when searching
    params.set('page', '1');

    if (search) {
      params.set('search', search);
    } else {
      params.delete('search');
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const clearSearch = () => {
    setSearch('');

    const params = new URLSearchParams(searchParams.toString());
    params.delete('search');
    params.set('page', '1');

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className='flex gap-2'>
      <div className='relative flex-1'>
        <Search className='text-muted-foreground absolute top-2.5 left-2.5 size-4' />
        <Input
          type='text'
          placeholder='Search URLs'
          value={search}
          onChange={e => setSearch(e.target.value)}
          className='pl-6'
        />
        {search && (
          <Button
            variant={'ghost'}
            onClick={clearSearch}
            className='absolute top-1/2 right-2.5 h-auto -translate-1/2 p-0'
          >
            <X className='size-4' />
          </Button>
        )}
      </div>
      <Button type='submit'>Search</Button>
    </form>
  );
}
