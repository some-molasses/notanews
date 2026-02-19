# algorithms assumptions

- no margins between articles
- no articles wrap bottom of the page
- paragraphs don't break across bottom of the page

# todo

### supabase

- Figure out row-level security SELECT needs on Supabase, especially pertaining to editor users vs normal users
- improve paper_members, profiles RLS
- add SQL indices
- use supabase enum types

### backend

- add schema validation to article endpoints
- ensure the backend routes only return the current user's issues, papers, etc.

### frontend

- move fetchApi calls to some central function library

### all

- issue deletion

# big todo

- writing timelines
- editing process
- auto-assembly of issue; how much auto to make it?
- distribution
- fix everything about supabase rls
