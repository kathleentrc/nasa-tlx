# NASA Task Load Index (NASA-TLX)
========

## About
This is an implementation of the NASA Task Load Index (NASA-TLX).

## General information
From the respective [Wikipedia article](http://en.wikipedia.org/wiki/NASA-TLX):
> The NASA Task Load Index (NASA-TLX) is a subjective, multidimensional assessment tool that rates perceived workload, in order to assess a task, system, or team’s effectiveness or other aspects of performance. It was developed by the Human Performance Group at NASA’s [Ames Research Center](http://en.wikipedia.org/wiki/Ames_Research_Center) over a three year development cycle that included more than 40 laboratory simulations. It has been cited in over 550 studies and a recent search for “NASA-TLX” on Google Scholar revealed over 3,660 articles. These statistics highlight the large influence the NASA-TLX has had in [Human Factors](http://en.wikipedia.org/wiki/Human_Factors) research.

Learn more about it at the official [NASA-TLX website](http://humansystems.arc.nasa.gov/groups/TLX/). You can also take a look at the original paper [<cite>Development of NASA-TLX (Task Load Index): Results of Empirical and Theoretical Research</cite>](http://humansystems.arc.nasa.gov/groups/TLX/downloads/NASA-TLXChapter.pdf) (PDF format, 1.4 MB).

## Modifications in this fork
- Added subjective assessment questions in the form of Likert-style scales.
- Added experiment groups for counterbalancing.
- Weighted TRX scores are now optional.
- Added multiple rounds for several between-subjects conditions.
- Demographic information is collected in Step 0.
- Created data structure for server communication
- Weights are stored accordingly
- Provided parameter definitions when weighing NASA TLX
- Revised instructions to hand over to experimenter before continuing the next NASA round
- TLX scales are reset before each round
- Added ERROR warnings to user input texts (can be deactivated by setting variable enforce_user_input to false)
- Removed Highcharts
- Integrated Node Express Server for Data Collection
- Added final questionnaire with open text forms

## Installation
[download](https://github.com/Til-D/nasa-tlx/archive/master.zip) the ZIP file, unzip it, install node, express, and other dependencies specified in the package.json, fire up the express server and navigate to localhost.

For detailed instruction on how to install express, go to [https://expressjs.com/](https://expressjs.com/)

## Credits
- [Francesco Schwarz](https://github.com/isellsoap/)
- [Tilman Dingler](https://github.com/Til-D/)

## Used libraries and utilities
- [jQuery](http://jquery.com/) ([MIT license](https://github.com/jquery/jquery/blob/master/MIT-LICENSE.txt))
- [jQuery UI](http://jqueryui.com/) ([MIT license](http://www.opensource.org/licenses/mit-license) or [GPL v2](http://opensource.org/licenses/GPL-2.0))
- [express](https://expressjs.com/) ([Creative Commons](https://creativecommons.org/licenses/by-sa/3.0/us/)

## License
This NASA-TLX implementation is published under the [MIT license](http://www.opensource.org/licenses/mit-license) and [GPL v3](http://opensource.org/licenses/GPL-3.0).
