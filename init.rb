module RedmineAssignToMeButton
  module IssuesControllerPatch
    def self.install
      return if IssuesController.action_methods.include?("assign_to_me_button")

      IssuesController.class_eval do
        skip_before_action :authorize, :only => [:assign_to_me_button]
        before_action :only => [:assign_to_me_button] do
          find_issue
        end

        def assign_to_me_button
          return render(:json => {:success => false}, :status => 403) unless User.current.logged?
          return render(:json => {:success => false}, :status => 403) unless User.current.admin? || User.current.allowed_to?(:edit_issues, @issue.project)
          return render(:json => {:success => false}, :status => 403) unless @issue.editable?
          return render(:json => {:success => false}, :status => 403) unless @issue.assignable_users.include?(User.current)
          return render(:json => {:success => false}, :status => 403) if @issue.assigned_to_id == User.current.id

          @issue.init_journal User.current
          @issue.assigned_to = User.current

          if @issue.save
            render :json => {:success => true}
          else
            render :json => {:success => false}, :status => 422
          end
        end
      end
    end
  end

  class Hooks < Redmine::Hook::ViewListener
    def view_layouts_base_body_bottom context={}
      c = context[:controller]
      return "" unless c
      return "" unless c.controller_name == "issues" && c.action_name == "show"

      issue = c.instance_variable_get(:@issue)
      return "" unless issue
      return "" unless User.current.logged?
      return "" unless issue.editable?
      return "" unless User.current.admin? || User.current.allowed_to?(:edit_issues, issue.project)
      return "" unless issue.assignable_users.include?(User.current)
      return "" if issue.assigned_to_id == User.current.id

      data = {
        :url => "/issues/#{issue.id}/assign_to_me_button",
        :token => c.send(:form_authenticity_token),
        :label => I18n.t(:label_assign_to_me)
      }

      c.helpers.javascript_include_tag("assign_to_me_button", :plugin => "redmine_assign_to_me_button") +
        "<script>window.redmineAssignToMeButton=#{data.to_json}</script>".html_safe
    end
  end
end

Rails.application.routes.prepend do
  post "issues/:id/assign_to_me_button", :to => "issues#assign_to_me_button"
end

Redmine::Plugin.register :redmine_assign_to_me_button do
  name "Redmine Assign To Me"
  description "Adds an Assign to me action on issue detail pages"
  author "Intera GmbH"
  version "0.1.0"
end

RedmineAssignToMeButton::IssuesControllerPatch.install
