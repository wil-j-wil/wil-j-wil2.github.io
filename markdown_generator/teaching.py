
# coding: utf-8

# # Talks markdown generator for academicpages
#
# Takes a TSV of talks with metadata and converts them for use with [academicpages.github.io](academicpages.github.io). This is an interactive Jupyter notebook ([see more info here](http://jupyter-notebook-beginner-guide.readthedocs.io/en/latest/what_is_jupyter.html)). The core python code is also in `talks.py`. Run either from the `markdown_generator` folder after replacing `talks.tsv` with one containing your data.
#
# TODO: Make this work with BibTex and other databases, rather than Stuart's non-standard TSV format and citation style.

# In[1]:

import pandas as pd
import os


# ## Data format
#
# The TSV needs to have the following columns: title, type, url_slug, venue, date, location, talk_url, description, with a header at the top. Many of these fields can be blank, but the columns must be in the TSV.
#
# - Fields that cannot be blank: `title`, `url_slug`, `date`. All else can be blank. `type` defaults to "Talk"
# - `date` must be formatted as YYYY-MM-DD.
# - `url_slug` will be the descriptive part of the .md file and the permalink URL for the page about the paper.
#     - The .md file will be `YYYY-MM-DD-[url_slug].md` and the permalink will be `https://[yourdomain]/talks/YYYY-MM-DD-[url_slug]`
#     - The combination of `url_slug` and `date` must be unique, as it will be the basis for your filenames
#


# ## Import TSV
#
# Pandas makes this easy with the read_csv function. We are using a TSV, so we specify the separator as a tab, or `\t`.
#
# I found it important to put this data in a tab-separated values format, because there are a lot of commas in this kind of data and comma-separated values can get messed up. However, you can modify the import statement, as pandas also has read_excel(), read_json(), and others.

# In[3]:

#talks = pd.read_csv("teaching.tsv", sep="\t", header=0)
talks = pd.read_csv("teaching.csv", header=0)
talks


# ## Escape special characters
#
# YAML is very picky about how it takes a valid string, so we are replacing single and double quotes (and ampersands) with their HTML encoded equivilents. This makes them look not so readable in raw format, but they are parsed and rendered nicely.

# In[4]:

html_escape_table = {
    "&": "&amp;",
    '"': "&quot;",
    "'": "&apos;"
    }

def html_escape(text):
    if type(text) is str:
        return "".join(html_escape_table.get(c,c) for c in text)
    else:
        return "False"


# ## Creating the markdown files
#
# This is where the heavy lifting is done. This loops through all the rows in the TSV dataframe, then starts to concatentate a big string (```md```) that contains the markdown for each type. It does the YAML metadata first, then does the description for the individual page.

# In[5]:

loc_dict = {}

for row, item in talks.iterrows():
    if (item.module, item.venue, item.role) not in loc_dict:
        loc_dict[(item.module, item.venue, item.role)] = (item.programme,
                                               item.type, item.description,
                                               item.url_slug, [item.year])
    elif (item.module, item.venue, item.role) in loc_dict:
        temp_tup = loc_dict[(item.module, item.venue, item.role)]
        loc_dict[(item.module, item.venue, item.role)] = temp_tup[:-1] + ([item.year] + temp_tup[-1],)

for module, venue, role in loc_dict:
    programme, module_type, description, url_slug, years = loc_dict[(module, venue, role)]

    md_filename = str(years[-1]) + "-" + url_slug + ".md"
    html_filename = str(years[-1]) + "-" + url_slug
    # year = item.date[:4]

    md = "---\nmodule: \"" + module + '"\n'

    md += "collection: teaching" + "\n"

    md += 'role: "' + role + '"\n'
    md += 'venue: "' + venue + '"\n'

    # Do the years
    md += 'years:\n'
    for year in years:
        md += ' - "' + year + '"\n'
    #  Do the years properly md += 'year: "' + year + '"\n'

    md += 'programme: "' + programme + '"\n'
    md += 'type: "' + module_type + '"\n'

    md += 'description: "' + description + '"\n'

    md += "permalink: /teaching/" + html_filename + "\n"

    md += "---\n"

    if len(str(description)) > 3:
        md += "\n" + html_escape(description) + "\n"

    md_filename = os.path.basename(md_filename)

    with open("../_teaching/" + md_filename, 'w') as f:
        f.write(md)


# These files are in the teaching directory, one directory below where we're working from.
