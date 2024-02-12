// Fetch data from the provided URL
d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
  .then(data => {
    const dataset = data.data;

    // Set up SVG dimensions
    const svgWidth = 800;
    const svgHeight = 400;
    const margin = { top: 20, right: 20, bottom: 50, left: 50 };
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    // Create SVG container
    const svg = d3.select('body')
      .append('svg')
      .attr('width', svgWidth)
      .attr('height', svgHeight)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create x and y scales
    const xScale = d3.scaleBand()
      .domain(dataset.map(d => d[0]))
      .range([0, width])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(dataset, d => d[1])])
      .range([height, 0]);

    // Create x and y axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    // Append x and y axes to the chart
    svg.append('g')
      .attr('id', 'x-axis')
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis);

    svg.append('g')
      .attr('id', 'y-axis')
      .call(yAxis);

    // Create bars
    svg.selectAll('.bar')
      .data(dataset)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('data-date', d => d[0])
      .attr('data-gdp', d => d[1])
      .attr('x', d => xScale(d[0]))
      .attr('y', d => yScale(d[1]))
      .attr('width', xScale.bandwidth())
      .attr('height', d => height - yScale(d[1]))
      .on('mouseover', d => {
        // Show tooltip on mouseover
        const tooltip = d3.select('#tooltip');
        tooltip.style('display', 'block')
          .attr('data-date', d[0])
          .html(`<strong>Date:</strong> ${d[0]}<br><strong>GDP:</strong> ${d[1]}`);
      })
      .on('mouseout', () => {
        // Hide tooltip on mouseout
        d3.select('#tooltip').style('display', 'none');
      });
  })
  .catch(error => console.error('Error loading data:', error));
