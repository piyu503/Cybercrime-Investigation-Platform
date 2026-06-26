from database.mongodb import get_database
import asyncio

async def test():
    db = get_database()
    case = await db['cases'].find_one(sort=[('_id', -1)])
    if not case:
        print('No cases')
        return
    for i, f in enumerate(case.get('files', [])):
        print(f"File {i}: {f.get('filename')}, type: {f.get('filetype')}")
        if f.get('is_processed'):
            pd = f.get('processed_data', {})
            t = pd.get('extracted_text', '')
            print(f"  processed: True, text len: {len(t)}, class: {pd.get('classification')}")
            print(f"  entities: {pd.get('entities')}")
        else:
            print('  processed: False')

asyncio.run(test())
