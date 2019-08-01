import React, { Component, Fragment } from 'react';
import { apiUrl } from '../../settings';
import PeopleHeader from '../PeopleHeader';
import PeopleFilter from '../PeopleFilter';
import PeopleList from '../PeopleList';
import { Typography } from '@material-ui/core';
import NotFound from '../NotFound';

class People extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            loading: true,
            search: '',
            page: 3,
            results: 0,
            hasNextPage: false,
            filter: {},
            filterOpen: false,
        }
    }

    getInitialContent = () => { // get initial content of 20 items
        let page = 1, search = '', items = [];
        this.setState({ loading: true })
        const url = new URL(`${apiUrl}/people`)
        console.log(search, page)
        for (page = 1; page < 3; page++) { // loop for page 1 and page 2
            const params = {
                search, page
            }
            for (let key in params)
                if (params[key])
                url.searchParams.append(key, params[key])
            fetch(url)
                .then(response => response.json())
                .then(({ results }) => {
                    console.log(results)
                    items = items.concat([...results])
                    this.setState({
                        loading: false,
                        items: items
                    })
                }
                )
        }
    }

    getContent = () => {
        this.setState({ loading: true })
        const { search, page } = this.state
        const url = new URL(`${apiUrl}/people`)
        console.log(search, page)
        const params = {
            search, page
        }
        for (let key in params)
            if (params[key])
                url.searchParams.append(key, params[key])
        console.log(url)
        fetch(url)
            .then(response => response.json())
            .then(({ count, next, results }) => {
                console.log(results, count, next)
                this.setState({
                    loading: false,
                    results: count,
                    hasNextPage: Boolean(next),
                    items: this.state.page > 0 && results !== undefined ? [...this.state.items, ...results] : [...this.state.items] // condition updated | Checking if the results have value
                })
            }
            )
    }

    handleSearch = search => {
        if (search === this.state.search) return
        this.setState({ search, items: [], page: 1 }, this.getContent)
    }

    onScroll() { // function calls on scroll
        var nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight;
        if (!this.props.fetching && nearBottom) {
            if (!this.state.hasNextPage) return
            this.setState({ page: this.state.page + 1 }, this.getContent) // calls the function getcontent
        }
    }

    componentDidMount() {
        this.getContent();
        this.getInitialContent();
        window.addEventListener("scroll", this.onScroll.bind(this), false); // subscribe an event listener
    }
    

    componentWillUnmount() { 
        window.removeEventListener("scroll", this.onScroll.bind(this), false);
        
    }

    getInitials(name) {
        name = name.toUpperCase().replace('-', '').split(' ')
        if (name.length >= 2)
            return name[0][0] + name[1][0]
        return name[0][0] + name[0][1]
    }

    getId(url) {
        url = url.split('/')
        return Number(url[url.length - 2])
    }

    handleFilterChange = (field, value) => this.setState({ filter: { ...this.state.filter, [field]: value } })

    toggleFilter = () => this.setState({ filterOpen: !this.state.filterOpen })

    getFilteredList() {
        const { filter, items } = this.state
        return items.filter(
            item => !Object.keys(filter).find(
                filterKey => filter[filterKey] && item[filterKey] !== filter[filterKey]
            )
        )
    }

    render() {
        const { hasNextPage, loading, filter, filterOpen } = this.state
        const items = this.getFilteredList()
        return (
            <Fragment>
                <PeopleHeader onSearch={this.handleSearch} onFilterOpen={this.toggleFilter} onNextPage={this.handleNextPage} />
                <main>
                    {!items.length && !loading &&
                        <NotFound title="No match found. Try to change the filter and the search terms.">
                            {hasNextPage && !loading &&
                                <Typography variant="subheading" align="center">You can also...</Typography>
                            }
                        </NotFound>
                    }
                    <PeopleList
                        loading={loading}
                        items={items}
                        nextPageButton={hasNextPage && !loading}
                    />
                </main>
                <aside>
                    <PeopleFilter
                        filters={filter}
                        open={filterOpen}
                        onChange={this.handleFilterChange}
                        onClose={this.toggleFilter} />
                </aside>
            </Fragment>
        );
    }
}

export default People;