import io
from data_processor import processor

CSV = """a,b,c
1,2,hello
2,,world
,3,
"""

def test_summarize():
    buf = io.StringIO(CSV)
    res = processor.summarize(buf)
    assert res['rows'] == 3
    assert res['columns'] == 3
    assert 'a' in res['columnsInfo']
    assert res['columnsInfo']['b']['missing'] == 1
