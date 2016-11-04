#!/usr/bin/env python
# Name:
# Student number:
'''
This script scrapes IMDB and outputs a CSV file with highest rated tv series.
'''
import csv
import unicodedata

from pattern.web import URL, DOM

TARGET_URL = "http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series"
BACKUP_HTML = 'tvseries.html'
OUTPUT_CSV = 'tvseries.csv'

url = URL(TARGET_URL)
dom = DOM(url.download(cached=True))
tvseries = []

def extract_tvseries(dom):
    '''
    Extract a list of highest rated TV series from DOM (of IMDB page).

    Each TV series entry should contain the following fields:
    - TV Title
    - Rating
    - Genres (comma separated if more than one)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    '''
    for link in dom.by_class("lister-item-content"):

        series = []

        for header in link.by_class("lister-item-header"):
            title = header.by_tag("a")
            series.append(title[0].content.encode("ASCII", "ignore"))

        rating = link.by_tag("strong")
        series.append(rating[0].content.encode("ASCII", "ignore"))

        genre = link.by_class("genre")
        series.append(genre[0].content.encode("ASCII", "ignore").strip())

        actors = []
        for p in link.by_tag("p"):
            for stars in p.by_tag("a"):
                 actors.append(unicodedata.normalize("NFKD", stars.content).encode("ASCII", "ignore"))
        series.append(', '.join(actors))

        runtime = link.by_class("runtime")
        runtime = runtime[0].content.encode("ASCII", "ignore").replace(" min", "")
        series.append(runtime)

        tvseries.append(series)

    return tvseries

def save_csv(f, tvseries):
    '''
    Output a CSV file containing highest rated TV-series.
    '''
    writer = csv.writer(f)
    writer.writerow(['Title', 'Rating', 'Genre', 'Actors', 'Runtime'])

    writer.writerows(tvseries)

if __name__ == '__main__':
    # Download the HTML file
    url = URL(TARGET_URL)
    html = url.download()

    # Save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # Parse the HTML file into a DOM representation
    dom = DOM(html)

    # Extract the tv series (using the function you implemented)
    tvseries = extract_tvseries(dom)

    # Write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'wb') as output_file:
        save_csv(output_file, tvseries)