import React from "react"
import { graphql } from "gatsby"
import { MDXRenderer } from "gatsby-plugin-mdx"
import { MDXProvider } from "@mdx-js/react"

import Layout from "../layout/layout"
import HeaderBody from "../components/headerBody"
import Callout from "../components/callout"
import Alert from "../components/alert"
import Accordion from "../components/accordion"
import ExternalLink from "../components/externalLink"
import Icon from "../components/icon"
import CustomIcon from "../components/CustomIcon"
import Popover from "../components/popover"
import TabList from "../components/tabList"
import Tab from "../components/tab"
import TOC from "../components/toc"
import Card from "../components/card"
import CardGroup from "../components/cardGroup"
import Navbar from "../components/navbar"
import NavButtons from "../components/navButtons"
import SEO from "../layout/seo"
import Releases from "../components/releases"
import TerminusVersion from "../components/terminusVersion"
import Commands from "../components/commands"
import GetFeedback from "../components/getFeedback"
import Enablement from "../components/enablement"
import Color from "../components/color.js"
import Download from "../components/download"
import BuildToolsOld from "../components/buildToolsOld.js"
import InstallBuildTools from "../components/InstallBuildTools.js"
import Partial from "../components/partial.js"
import Image from "../layout/image"
import ChecklistItem from "../components/checklistItem"
import BuildProjectCreateCommandGenerator from "../components/build-project-create-command-generator"
import {
  BuildToolsStackSelectToolbar,
  BuildToolsSelectCMS,
  BuildToolsSelectGitandCI,
  CMS,
  GitProvider,
  CIProvider,
  BuildToolsWorkflowDiagram
} from "../components/BuildTools"

let shortcodes = {
  Callout,
  Alert,
  Accordion,
  ExternalLink,
  Icon,
  CustomIcon,
  Popover,
  TabList,
  Tab,
  Card,
  CardGroup,
  Releases,
  TerminusVersion,
  Commands,
  Enablement,
  Download,
  BuildToolsOld,
  InstallBuildTools,
  Partial,
  ChecklistItem,
  Image,
  BuildProjectCreateCommandGenerator,
  BuildToolsStackSelectToolbar,
  BuildToolsSelectCMS,
  BuildToolsSelectGitandCI,
  BuildToolsWorkflowDiagram,
  CMS,
  GitProvider,
  CIProvider
}

class GuideTemplate extends React.Component {
  componentDidMount() {
    window.jQuery('[data-toggle="tooltip"]').popover({
      trigger: "hover",
      placement: "right",
    })
  }

  render() {
    const node = this.props.data.mdx
    const contentCols = node.frontmatter.showtoc ? 9 : 12

    const items = this.props.data.allMdx.edges.map(item => {
      return {
        id: item.node.id,
        link: item.node.fields.slug,
        title: item.node.frontmatter.subtitle,
      }
    })

    return (
      <Layout>
        <SEO
          title={node.frontmatter.subtitle + " | " + node.frontmatter.title}
          description={node.frontmatter.description || node.excerpt}
          authors={node.frontmatter.contributors}
          image={"/assets/images/terminus-thumbLarge.png"}
        />
        <div>
          <div className="container">
            <div className="row col-md-12 guide-nav manual-guide-toc-well">
              <Navbar
                title={node.frontmatter.title}
                activePage={node.fields.slug}
                items={items}
              />
              <div id="terminus" className="terminus col-md-9 guide-doc-body">
                <div className="row guide-content-well">
                  <div
                    className={`col-xs-${contentCols} col-md-${contentCols}`}
                  >
                    <HeaderBody
                      title={node.frontmatter.title}
                      subtitle={node.frontmatter.subtitle}
                      description={node.frontmatter.description}
                      slug={node.fields.slug}
                      contributors={node.frontmatter.contributors}
                      featured={node.frontmatter.featuredcontributor}
                      editPath={node.fields.editPath}
                    />
                    <MDXProvider components={shortcodes}>
                      <MDXRenderer>{node.body}</MDXRenderer>
                    </MDXProvider>
                  </div>
                  {node.frontmatter.showtoc && (
                    <div
                      className="col-md-3 pio-docs-sidebar hidden-print hidden-xs hidden-sm affix-top"
                      role="complementary"
                    >
                      <TOC title="Contents" />
                    </div>
                  )}
                </div>
                {node.frontmatter.getfeedbackform && (
                  <GetFeedback
                    formId={
                      node.frontmatter.getfeedbackform === "default"
                        ? "tfYOGoE7"
                        : node.frontmatter.getfeedbackform
                    }
                    page={"/" + node.fields.slug}
                    topic="addons"
                  />
                )}
                <NavButtons
                  prev={this.props.pageContext.previous}
                  next={this.props.pageContext.next}
                />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    )
  }
}

export default GuideTemplate

export const pageQuery = graphql`
  query BuildToolsGuidePageBySlug($slug: String!, $guide_directory: String!) {
    mdx(
        fields: { slug: { eq: $slug } }
        frontmatter: {layout: {eq: "guide-build-tools"}}
      ) {
      id
      body
      fields {
        slug
        guide_directory
        editPath
      }
      frontmatter {
        title
        subtitle
        description
        showtoc
        editpath
        contributors {
          id
          name
          twitter
          bio
          avatar
          url
        }
        featuredcontributor
        getfeedbackform
      }
      fileAbsolutePath
    }

    allMdx(
      filter: {
        fileAbsolutePath: { ne: null }
        fields: { guide_directory: { eq: $guide_directory } }
      }
      sort: { fields: [fileAbsolutePath], order: ASC }
    ) {
      edges {
        node {
          id
          fields {
            slug
            guide_directory
          }
          frontmatter {
            subtitle
          }
        }
      }
    }
  }
`
